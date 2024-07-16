import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/productos', async (req, res) => {
    const {rows} = await pool.query('select * from productos');
    res.json(rows);
})

router.get('/productos/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from productos where productoid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "Consecionario no encontrado"})
    }

    res.json(rows[0])
})

router.post('/productos', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into productos (nombre, descripcion, cantidad, precio) values ($1, $2, $3, $4)',
         [data.nombre, data.descripcion, data.cantidad, data.precio])
    console.log(result)
    res.send('Creando Producto')

})

router.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update productos set activo = false where productoid = $1 and activo = true', [id]);
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

router.put('/productos/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update productos set nombre = $1, descripcion = $2, cantidad = $3, precio = $4 where productoid = $5', 
        [data.nombre, data.descripcion, data.cantidad, data.precio, id]
    );

     res.send(data);
});

router.patch('/productos/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE productos SET ${setString} WHERE productoid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`productos con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`productos con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el detalleventa');
    }
});

export default router;