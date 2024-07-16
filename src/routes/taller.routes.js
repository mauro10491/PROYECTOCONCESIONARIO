import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/taller', async (req, res) => {
    const {rows} = await pool.query('select * from taller');
    res.json(rows);
})

router.get('/taller/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from taller where tallerid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "Venta no encontrado"})
    }

    res.json(rows[0])
})

router.post('/taller', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into taller (nombre, direccion, ciudad, telefono) values ($1, $2, $3, $4)', 
        [data.nombre, data.direccion, data.ciudad, data.telefono])
    console.log(result)
    res.send('Creando Taller')

})

router.delete('/taller/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update taller set activo = false where tallerid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`taller con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`taller con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del taller');
    }
});

router.put('/taller/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update taller set nombre = $1, direccion = $2, ciudad = $3, telefono = $4 where tallerid = $5', 
        [data.nombre, data.direccion, data.ciudad, data.telefono, id]
    );

     res.send(data);
});

router.patch('/taller/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE taller SET ${setString} WHERE tallerid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`taller con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`taller con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el taller');
    }
});

export default router;