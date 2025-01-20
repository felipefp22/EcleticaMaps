const mysql = require('mysql2');

// Configuração de conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',        // O host onde o MySQL está rodando
  user: 'root',             // Usuário do MySQL
  password: 'minha_senha',  // Senha do MySQL
  database: 'ecletica'      // Nome do banco de dados
});

// Função para conectar ao banco de dados
function connectToDatabase() {
  return new Promise((resolve, reject) => {
    connection.connect(err => {
      if (err) {
        reject('Erro ao conectar ao banco de dados: ' + err.message);
      } else {
        resolve('Conectado ao banco de dados MySQL.');
      }
    });
  });
}

// Função para executar a query
function queryDatabase(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject('Erro ao executar a query: ' + err.message);
      } else {
        resolve(results);
      }
    });
  });
}

// Função para encerrar a conexão com o banco
function closeConnection() {
  return new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        reject('Erro ao encerrar a conexão: ' + err.message);
      } else {
        resolve('Conexão encerrada.');
      }
    });
  });
}

// Função principal para realizar consulta
export async function fetchData() {
  try {
    // Conectar ao banco de dados
    const connectionMessage = await connectToDatabase();
    console.log(connectionMessage);

    // Realizar a consulta (por exemplo, buscar todos os registros da tabela "pedidos")
    const query = 'SELECT * FROM pedidos';
    const results = await queryDatabase(query);
    console.log('Resultados da tabela pedidos:', results);

    // Fechar a conexão
    const closeMessage = await closeConnection();
    console.log(closeMessage);
    return results;
  } catch (error) {
    console.error('Erro:', error);
  }
}