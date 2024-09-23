import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const categoria = await prisma.categoria.findMany();

  if (categoria.length === 0) {
    const categorias = await prisma.categoria.createMany({
      data: [
        { nome: "Infraestrutura" },
        { nome: "Segurança" },
        { nome: "Ambiente" },
        { nome: "Serviços Públicos" }
      ]
    });
  }

  const status = await prisma.status.findMany();

  if (status.length === 0) {
    const status = await prisma.status.createMany({
      data: [
        { nome: "Pendente" },
        { nome: "Resolvido" }
      ]
    });
  }

  const cargo = await prisma.cargo.findMany();

  if (cargo.length === 0 ){
  const cargos = await prisma.cargo.createMany({
    data: [
      { nome: "Administrador" },
      { nome: "Cidadao" }
    ]
  })
}

  console.log('Dados de categorias, status e cargo inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
