module.exports = function(http){
  http.listen(3000, () => {
    const d = new Date();
    const n = d.getHours();
    const m = d.getMinutes();
    console.log('Server has been started at: ' + n + ':' + m);
  });
};
