import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/vendedores', async (req, res) => {
    const {rows} = await pool.query('select * from vendedores');
    res.json(rows);
})

router.get('/vendedores/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from vendedores where vendedorid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "Consecionario no encontrado"})
    }

    res.json(rows[0])
})

router.post('/vendedores', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into vendedores (consecionarioid, nombre, telefono) values ($1, $2, $3)',
         [data.consecionarioid, data.nombre, data.telefono])
    console.log(result)
    res.send('Creando Vendedor')

})

router.delete('/vendedores/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update vendedores set activo = false where vendedorid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`vendedor con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`vendedor con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del vendedor');
    }
});

router.put('/vendedores/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update vendedores set nombre = $1, telefono = $2 where vendedorid = $3', 
        [data.nombre, data.telefono, id]
    );

     res.send(data);
});

router.patch('/vendedores/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE vendedores SET ${setString} WHERE vendedorid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`vendedores con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`vendedores con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el vendedores');
    }
});

export default router;