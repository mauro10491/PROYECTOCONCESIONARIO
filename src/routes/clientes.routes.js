import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/clientes', async (req, res) => {
    const {rows} = await pool.query('select * from clientes');
    res.json(rows);
})

router.get('/clientes/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from clientes where clienteid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "cliente no encontrado"})
    }

    res.json(rows[0])
})

router.post('/clientes', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into clientes (nombre, direccion, telefono, ciudad, departamento) values ($1, $2, $3, $4, $5)', 
        [data.nombre, data.direccion, data.telefono, data.ciudad, data.departamento])
    console.log(result)
    res.send('Creando Vendedor')

})

router.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update clientes set activo = false where clienteid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`Cliente con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`Cliente con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del cliente');
    }
});

router.put('/clientes/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    try {
        const result = await pool.query('update clientes set nombre = $1, direccion = $2, telefono = $3, ciudad = $4, departamento = $5 where clienteid = $6', 
            [data.nombre, data.direccion, data.telefono, data.ciudad, data.departamento, id]
        );

        if (result.rowCount > 0) {
            res.status(200).send(`Cliente con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`Cliente con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el vendedor');
    }
     res.send(data);
});

router.patch('/clientes/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE clientes SET ${setString} WHERE clienteid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`Cliente con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`Cliente con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el cliente');
    }
});

export default router;