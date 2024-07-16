import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/consecionarios', async (req, res) => {
    const {rows} = await pool.query('select * from consecionario');
    res.json(rows);
});

router.get('/consecionarios/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from consecionario where consecionarioid = $1', [id])

    if(rows.length === 0){
        return res.status(404).json({message: "Consecionario no encontrado"})
    }

    res.json(rows[0]);
});

router.post('/consecionarios', async (req, res) => {
    const data = req.body  
    const {result} = await pool.query('insert into consecionario (nombre, direccion, ciudad, telefono, activo) values ($1, $2, $3, $4, $5)',
         [data.nombre, data.direccion, data.ciudad, data.telefono, data.activo])
    console.log(result)
    res.send('Consecionario creado')
});

router.delete('/consecionarios/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update consecionario set activo = false where consecionarioid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`Consecionario con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`Consecionario con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del consecionario');
    }
});

router.put('/consecionarios/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update consecionario set nombre = $1, direccion = $2, ciudad = $3, telefono = $4, activo = $5 where consecionarioid = $6', 
        [data.nombre, data.direccion, data.ciudad, data.telefono, data.activo, id]
    );

     res.send(data);
});

router.patch('/consecionarios/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE consecionario SET ${setString} WHERE consecionarioid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`consecionario con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`consecionario con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el consecionario');
    }
});

export default router;