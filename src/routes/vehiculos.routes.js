import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/vehiculos', async (req, res) => {
    const {rows} = await pool.query('select * from vehiculos');
    res.json(rows);
})

router.get('/vehiculos/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from vehiculos where vehiculoid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "vehiculo no encontrado"})
    }

    res.json(rows[0])
})

router.post('/vehiculos', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into vehiculos (productoid, marca, modelo, año) values ($1, $2, $3, $4)',
         [data.productoid, data.marca, data.modelo, data.año])
    console.log(result)
    res.send('Creando vehiculo')

})

router.delete('/vehiculos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update vehiculos set activo = false where vehiculoid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`vehiculo con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`vehiculo con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del vehiculo');
    }
});

router.put('/vehiculos/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update vehiculos set marca = $1, modelo = $2, año = $3 where vehiculoid = $4', 
        [data.marca, data.modelo, data.año, id]
    );

     res.send(data);
});

router.patch('/vehiculos/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE vehiculos SET ${setString} WHERE vehiculoid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`vehiculos con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`vehiculos con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el vehiculos');
    }
});

export default router;