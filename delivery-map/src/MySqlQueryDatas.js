const mysql = require('mysql2');

// Configuração de conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost', // O host onde o MySQL está rodando
  user: 'root',      // Usuário do MySQL
  password: 'minha_senha', // Senha do MySQL
  database: 'ecletica'    // Nome do banco de dados (altere para o seu banco)
});

// Conecta ao banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');

  // Query para buscar todos os registros da tabela "pedidos"
  const query = 'SELECT * FROM pedidos';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao executar a query:', err.message);
      connection.end();
      return;
    }

    // Exibe os resultados no console
    console.log('Resultados da tabela pedidos:', results);

    // Encerra a conexão com o banco
    connection.end(err => {
      if (err) {
        console.error('Erro ao encerrar a conexão:', err.message);
      } else {
        console.log('Conexão encerrada.');
      }
    });
  });
});



// USE ecletica;

// CREATE TABLE pedidos (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     lat DOUBLE,
//     lng DOUBLE,
//     data_pedido DATETIME
// );

// INSERT INTO pedidos (lat, lng, data_pedido) VALUES
// (-23.689106873992, -46.710394001780896, '2025-01-01 10:54:00'),
// (-23.695047472947353, -46.708394001780896, '2025-01-01 10:59:00'),
// (-23.689047472947353, -46.704394001780896, '2025-01-01 11:04:00'),
// (-23.691047472947353, -46.705394001780896, '2025-01-01 11:09:00'),
// (-23.695106873992, -46.71266202199305, '2025-01-01 11:14:00'),
// (-23.691047472947353, -46.708394001780896, '2025-01-01 11:19:00'),
// (-23.687047472947353, -46.702394001780896, '2025-01-01 11:24:00'),
// (-23.695047472947353, -46.710394001780896, '2025-01-01 11:29:00'),
// (-23.696106873992, -46.71166202199305, '2025-01-01 11:34:00'),
// (-23.694047472947353, -46.712394001780896, '2025-01-01 11:39:00'),
// (-23.6939504747294735 -46.709394001780896, '2025-01-01 11:44:00'),
// (-23.691047472947353, -46.711394001780896, '2025-01-01 11:49:00'),
// (-23.689106873992, -46.70866202199305, '2025-01-01 11:54:00'),
// (-23.692047472947353, -46.710394001780896, '2025-01-01 11:59:00');