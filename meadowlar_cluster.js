const cluster = require('cluster');

function startWorker() {
  const worker = cluster.fork();
  console.log(`Кластер: исполнитель ${worker.id} запущен`);
}

if(cluster.isMaster){

  require('os').cpus().forEach(startWorker);

  cluster.on('disconnect', worker => console.log(
    `Кластер: Исполнитель ${worker.id} отключился от кластера.`
  ));

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Кластер: Исполнитель ${worker.id} завершил работу ` +
      `с кодом завершения ${code} (${signal})`
    );
    
    startWorker();
  });

} else {

    const port = process.env.PORT || 3000;

    require('./meadowlark.js')(port);

}