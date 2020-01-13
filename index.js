const express = require('express');
const app = express();
const port = 3000;
const connection = require('./conf')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET ALL
app.get('/reveillon_playlist', (request, response) => {
  connection.query('SELECT * FROM reveillon_playlist', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de l affichage des musiques de la playlist')
    } else {
      response.json(results).status(200);
    }
  });
});

// GET titre + artiste
app.get('/reveillon_playlist/titre/artiste', (request, response) => {
  connection.query('SELECT titre, artiste FROM reveillon_playlist', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de la récupération du titre et de l artiste')
    } else {
      response.json(results).status(200);
    }
  });
});

// GET WHERE artiste INCLUDE B
app.get('/reveillon_playlist/B', (request, response) => {
  connection.query('SELECT * FROM reveillon_playlist WHERE artiste LIKE "%b%"', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de la récupération du nom des artistes contenant un b')
    } else {
      response.json(results).status(200);
    }
  });
});

// GET WHERE titre STARTS BY I
app.get('/reveillon_playlist/i', (request, response) => {
  connection.query('SELECT * FROM reveillon_playlist WHERE titre LIKE "i%"', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de la récupération des titres commencant par i')
    } else {
      response.json(results).status(200);
    }
  });
});

// GET WHERE annee_sortie = 2019
app.get('/reveillon_playlist/sortie=2019', (request, response) => {
  connection.query('SELECT * FROM reveillon_playlist WHERE annee_sortie = 2019', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de la récupération des titres sortie en 2019')
    } else {
      response.json(results).status(200);
    }
  });
});

// GET ALL ORDER BY artiste DSC
app.get('/reveillon_playlist/artistedesc', (request, response) => {
  connection.query('SELECT * FROM reveillon_playlist ORDER BY artiste DESC', (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors du classement des artistes par ordre Z à A')
    } else {
      response.json(results).status(200);
    }
  });
});


// POST ONE
app.post('/reveillon_playlist/', (request, response) => {
  const formData = request.body;
  connection.query('INSERT INTO reveillon_playlist SET ? WHERE id = ?', [formData], (error, results) => {
    if (error) {
      response.status(500).send('Erreur lors de  affichage d un morceau d une playlist')
    } else {
      response.json(formData).status(200);
    }
  });
});

// PUT MODIFY ONE
app.put('/reveillon_playlist/:id', (request, response) => {
  const idZik = request.params.id;
  const formData = request.body;
  connection.query('UPDATE reveillon_playlist SET ? WHERE id = ?', [formData, idZik], error => {
    if (error) {
      response.status(500).send('Erreur lors de la modification d un item');
    } else {
      response.json(formData).status(200);
    }
  });
});
// PUT MODIFY TOGGLE ALL BOOLEAN 
app.put('/reveillon_playlist/toggle', (request, response) => {
  connection.query('UPDATE reveillon_playlist SET awarded = NOT awarded', error => {
    if (error) {
      response.status(500).send('Erreur lors de la mise à jour d un boolean');
    } else {
      response.status(200).send('Modification effectuée');
    }
  });
});

// DELETE ONE 
app.delete("/reveillon_playlist/:id", (request, response) => {
  const id = request.params.id;
  connection.query('DELETE FROM reveillon_playlist WHERE id = ?', [id], error => {
    if (error) {
      console.log('Erreur de lors suppression d un item')
    } else {
      response.status(200).send('Musique supprimé')
    }
  });
});

// DELETE ALL WITH FALSE BOOL 
app.delete("/reveillon_playlist/not_awarded", (req, res) => {
  const not_awarded = request.body.recompense;
  connection.query(`DELETE FROM reveillon_playlist  WHERE awarded = false`, [not_awarded], error => {
    if (error) {
      res.status(500).send("Erreur lors de la suppression des musiques non recompensées");
    } else {

      res.status(200).send("Suppression effectuée");
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('');
  }
  console.log(`Server is listening on ${port}`)
});
