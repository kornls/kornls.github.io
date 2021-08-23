<style> @font-face { font-family: chirp; src: url(gt-america.ttf); } * { font-family: chirp; } </style>

# Thailand Covid Today

<html>
  <h2>New cases</h2>
  <br>
  <p id="new">Loading...</p>
  <br><br><br>
  <h2>Total cases</h2>
  <br>
  <p id="total">Loading...</p>
  <br><br><br>
  <h2>Last Updated</h2>
  <br>
  <p id="updated">Loading...</p>

  fetch(`https://covid19.ddc.moph.go.th/api/Cases/today-cases-all`).then(res => res.json()).then(data => {
    document.getElementById("new").innerHTML = data["new_case"];
    document.getElementById("total").innerHTML = data["total_case"];
    document.getElementById("update").innerHTML = data["update_date"];
  }

</html>
