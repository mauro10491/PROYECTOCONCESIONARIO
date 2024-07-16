import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/detalleventas', async (req, res) => {
    const {rows} = await pool.query('select * from detalleventa');
    res.json(rows);
})

router.get('/detalleventas/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from detalleventa where detalleid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "detalle de la venta no encontrado"})
    }

    res.json(rows[0])
})

router.post('/detalleventas', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into detalleventa (ventaid, productoid, cantidad, precio) values ($1, $2, $3, $4)', 
        [data.ventaid, data.productoid, data.cantidad, data.precio])
    console.log(result)
    res.send('Creando Detalle de Venta')

})

router.delete('/detalleventas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update detalleventa set activo = false where detalleid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`detalleventa con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`detalleventa con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del detalleventa');
    }
});

router.put('/detalleventas/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update detalleventa set cantidad = $1, precio = $2 where ventaid = $3', 
        [data.cantidad, data.precio, id]
    );

     res.send(data);
});

router.patch('/detalleventas/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE detalleventa SET ${setString} WHERE detalleid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`detalleventa con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`detalleventa con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el detalleventa');
    }
});

export default router;