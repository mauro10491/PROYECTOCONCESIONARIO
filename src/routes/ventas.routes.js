import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/ventas', async (req, res) => {
    const {rows} = await pool.query('select * from ventas');
    res.json(rows);
})

router.get('/ventas/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from ventas where ventaid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "Venta no encontrado"})
    }

    res.json(rows[0])
})

router.post('/ventas', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into ventas (clienteid, vendedorid, fecha, total) values ($1, $2, $3, $4)', 
        [data.clienteid, data.vendedorid, data.fecha, data.total])
    console.log(result)
    res.send('Creando Ventas')

})

router.delete('/ventas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update ventas set activo = false where ventaid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`venta con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`venta con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del venta');
    }
});

router.put('/ventas/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update ventas set fecha = $1, total = $2 where ventaid = $3', 
        [data.fecha, data.total, id]
    );

     res.send(data);
});

router.patch('/ventas/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE ventas SET ${setString} WHERE ventaid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`ventas con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`ventas con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el ventas');
    }
});

export default router;