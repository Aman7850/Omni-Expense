// export const createTable = () => {
//   useEffect(() => {
//     console.log('hello1');
//     db.transaction(function (txn) {
//       txn.executeSql(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name=Customer_table",
//         [],
//         function (tx, res) {
//           console.log('item:', res.rows.length);
//           console.log('hello3');
//           if (res.rows.length == 0) {
//             //txn.executeSql('DROP TABLE IF EXISTS Customer_table', []);
//             txn.executeSql(
//               'CREATE TABLE IF NOT EXISTS Customer_table(Customer_id INTEGER PRIMARY KEY AUTOINCREMENT,  email VARCHAR(30), password VARCHAR(255))',
//               [],
//             );
//           }
//         },
//       );
//     });
//   }, []);
// };
