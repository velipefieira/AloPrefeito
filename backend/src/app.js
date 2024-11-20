import express from 'express';
import bodyParser from 'body-parser';
import buscadorRelato from './buscadores/buscadorRelato.js';
import buscadorCategoria from './buscadores/buscadorCategoria.js'
import cadastradorRelato from './cadastradores/cadastradorRelato.js';
import cors from 'cors';
import multer from 'multer'
import { Buffer } from 'buffer';
import buscadorUsuario from './buscadores/buscadorUsuario.js';
import buscadorComentarios from './buscadores/buscadorComentarios.js';
import atualizadorUsuario from './atualizadores/atualizadorRelato.js';
import auth from './middlewares/auth.js';
import cadastradorUsuario from './cadastradores/cadastradorUsuario.js';
import cadastradorComentario from './cadastradores/cadastradorComentario.js';
import atualizadorRelato from './atualizadores/atualizadorRelato.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

// Rotas
const router = express.Router();
router.get('/', (req, res) => {
  res.json('Back-End;');
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    res.status(400).json({ message: 'Por favor, forneça e-mail e senha' });
  }

  try {
    const { token, credencial } = await auth.login(email, senha)

    if (token !== undefined || credencial !== undefined) {

      res.status(200).json({
        token
      });
    } else {
      res.status(200).json({ token: 'E-mail ou senha incorretos' });
    }
  } catch (error) {
    res.status(500).json('Erro no servidor', error);
  }
});

router.get('/relato', async (req, res) => {
  try {
    let relatos = await buscadorRelato.buscarRelatos();

    const relatosComImagens = await Promise.all(relatos.map(async relato => {
      if (relato.imagem !== null) {
        relato.imagem = await blobToBase64(relato.imagem);
      } else {
        console.log("não converti a imagem do relato " + relato.id);
      }
      return relato;
    }));

    res.json(relatosComImagens);
  } catch (error) {
    res.status(500).json("Erro ao buscar relatos", error);
  }
});

router.get('/relato/:id', async (req, res) => {
  let id = parseInt(parseInt(req.params.id))
  let relatos = await buscadorRelato.buscarRelatosPorId(id)

  try {
    const relatosComImagens = await Promise.all(relatos.map(async relato => {
      if (relato.imagem !== null) {
        relato.imagem = await blobToBase64(relato.imagem);
      } else {
        console.log("não converti a imagem do relato " + relato.id);
      }
      return relato;
    }));

    res.json(relatosComImagens);
  } catch (error) {
    res.status(500).json("Erro ao buscar relatos", error);
  }
});

router.get('/comentario/relato/:id', async (req, res) => {
  let id = parseInt(req.params.id)
  try {
    let comentarios = await buscadorComentarios.buscarcomentarioPorRelato(id);
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json("Erro ao buscar comentarios", error);
  }
});

router.get('/categoria', async (req, res) => {
  let categoria = await buscadorCategoria.buscarCategorias()
  res.json(categoria)
})

router.get('/relato/usuario/:id', async (req, res) => {
  let id = parseInt(req.params.id)
  let relatos = await buscadorRelato.buscarRelatosPorUsuario(id)

  try {
    const relatosComImagens = await Promise.all(relatos.map(async relato => {
      if (relato.imagem !== null) {
        relato.imagem = await blobToBase64(relato.imagem);
      } else {
        console.log("não converti a imagem do relato " + relato.id);
      }
      return relato;
    }));

    res.json(relatosComImagens);
  } catch (error) {
    console.error("Erro ao buscar relatos:", error);
    res.status(500).json({ error: "Erro ao buscar relatos" });
  }
})

/* 
router.get('/feedback', userController.getAllUsers);
*/


router.get('/usuario', async (req, res) => {
  let usuario = await buscadorUsuario.buscarUsuarios()
  res.json(usuario)
})

router.get('/usuario/:id', async (req, res) => {
  let id = parseInt(req.params.id)
  let usuarios = await buscadorUsuario.buscarUsuariosPorId(id)
  res.json(usuarios)
})


router.post('/relato/cadastrar', upload.single('imagem'), (req, res) => {

  const imagem = req.file ? req.file.buffer : null;

  try {
    cadastradorRelato.cadastrarRelato(req.body, imagem);
    res.status(201).json("Relato cadastrado com sucesso");
  } catch (error) {
    res.status(500).json("Erro ao cadastrar relato", error);
  }
});

router.post('/comentario/cadastrar/:id', async (req, res) => {
  let id = parseInt(parseInt(req.params.id))
  try {
    cadastradorComentario.cadastrarComentario(id, req.body)
    res.status(201).json({ message: 'Comentário registrado com sucesso' });
  } catch (error) {
    res.status(500).json("Erro ao registrar comentário", error);
  }
});

//router.delete('/relato/excluir/:id', excluidorRelato.deleteUser);

router.post('/usuario/cadastrar', async (req, res) => {
  try {
    let verificacao = await buscadorUsuario.verificarUsuario(req.body)
    if (verificacao) {
      res.status(202).json({ message: 'CPF ou E-Mail já cadastrado' })
    } else {
      cadastradorUsuario.cadastrarUsuario(req.body)
      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    }
  } catch (error) {
    res.status(500).json('Erro ao registrar usuário:', error);
  }
});

router.put('/relato/atualizar/:id', async (req, res) => {
  let id = parseInt(parseInt(req.params.id))
  try {
    atualizadorRelato.atualizarRelato(id)
    res.status(201).json("Relato atualizado com sucesso")
  } catch (error) {
    res.status(500).json("Erro ao atualizar usuário", error)
  }
});
/* 

router.put('/usuario/atualizar/:id', userController.updateUser);

router.delete('/usuario/excluir/:id', userController.deleteUser);
*/

app.use(router);

const blobToBase64 = blob => {
  return new Promise(resolve => {
    const base64String = Buffer.from(blob).toString('base64');
    resolve(`data:image/jpeg;base64,${base64String}`);
  });
};

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
