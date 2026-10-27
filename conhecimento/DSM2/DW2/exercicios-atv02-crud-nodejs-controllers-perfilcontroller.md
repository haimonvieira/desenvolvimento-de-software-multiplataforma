---
disciplina: DSM2/DW2
titulo: PerfilController
fonte: DSM2/DW2/exercicios/ATV02-CRUD-NODEJS/controllers/PerfilController.js
tipo: js
paginas: 0
extraido_em: 2026-10-24
---

```javascript
import express from 'express';
const router = express.Router();

import Perfil from '../models/Perfil.js';


router.get('/perfil', (req, res) => {
    
    Perfil.findByPk(1).then(perfil => {
        res.render("perfil", {
            perfil
        })
    }).catch(error => {
        console.log("Erro ao buscar perfil: " + error);
    })

})

router.post('/perfil/:id', (req, res) => {
    const id = req.params.id;
    const codinome = req.body.codinome;
    const no_conectado = req.body.no_conectado;

    Perfil.update(
        {
            codinome: codinome,
            no_conectado: no_conectado
        },
        {
            where:{
                id: id
            }
        }
    ).then(() =>{
        res.redirect('/perfil');
    })

});

export default router;
```
