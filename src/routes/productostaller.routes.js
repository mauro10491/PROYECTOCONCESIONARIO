import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/productostaller', async (req, res) => {
    const {rows} = await pool.query('select * from productostaller');
    res.json(rows);
})

router.get('/productostaller/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from productostaller where productostallerid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "no encontrado"})
    }

    res.json(rows[0])
})

router.post('/productostaller', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into productostaller (productoid, tallerid) values ($1, $2)', 
        [data.productoid, data.tallerid])
    console.log(result)
    res.send('Creando Producto Taller')

})

router.delete('/productostaller/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update productostaller set activo = false where productostallerid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`productos con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`productos con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del productos');
    }
});

router.put('/productostaller/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update productostaller set productoid = $1, tallerid = $2 where productostallerid = $3', 
        [data.productoid, data.tallerid, id]
    );

     res.send(data);
});


router.patch('/productostaller/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE productostaller SET ${setString} WHERE productostallerid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`productostaller con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`productostaller con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el productostaller');
    }
});

export default router;