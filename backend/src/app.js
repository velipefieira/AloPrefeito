import express from 'express';
import bodyParser from 'body-parser';
import buscadorRelato from './buscadores/buscadorRelato.js';
import buscadorCategoria from './buscadores/buscadorCategoria.js'
import cadastradorRelato from './cadastradores/cadastradorRelato.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas
const router = express.Router();
router.get('/', (req, res) => {
  res.json('Back-End;');
});

router.get('/relato', async (req,res) => {
  let relatos = await buscadorRelato.buscarRelatos()
  res.json(relatos)
});

router.get('/relato/:id', async (req,res) => {
  let id = parseInt(req.params.id)
  let relatos = await buscadorRelato.buscarRelatosPorId(id)
  res.json(relatos)
});

router.get('/categoria', async (req,res) => {
  let categoria = await buscadorCategoria.buscarCategorias()
  res.json(categoria)
})

/* router.get('/relato/usuario/:id', buscadorRelato.getUserById);
router.get('/feedback', userController.getAllUsers);
router.get('/usuario', userController.getAllUsers);
router.get('/usuario/:id', userController.getUserById); */

router.post('/relato/cadastrar', (req, res) => {
  try {
    cadastradorRelato.cadastrarRelato(req.body)
    res.status(201).json("Relato cadastrado com sucesso")
  } catch (error) {    
    res.status(500).json("Erro ao cadastrar relato", error)
  }
});

//router.put('/relato/atualizar/:id', atualizadorRelato.updateUser);
//router.delete('/relato/excluir/:id', excluidorRelato.deleteUser);

/* router.post('/usuario/cadastrar', userController.createUser);
router.put('/usuario/atualizar/:id', userController.updateUser);
router.delete('/usuario/excluir/:id', userController.deleteUser); */

app.use(router);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
