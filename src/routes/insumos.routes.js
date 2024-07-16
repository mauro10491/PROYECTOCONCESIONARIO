import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

router.get('/insumos', async (req, res) => {
    const {rows} = await pool.query('select * from insumos');
    res.json(rows);
})

router.get('/insumos/:id', async (req, res) => {
    const {id} = req.params
    const {rows} = await pool.query('select * from insumos where insumoid = $1', [id]);

    if(rows.length === 0){
        return res.status(404).json({message: "Consecionario no encontrado"})
    }

    res.json(rows[0])
})

router.post('/insumos', async (req, res) => {
    const data = req.body
    const result = await pool.query('insert into insumos (productoid, color, familia, serie, fechaexpedicion, fechavencimiento) values ($1, $2, $3, $4, $5, $6)',
         [data.productoid, data.color, data.familia, data.serie, data.fechaexpedicion, data.fechavencimiento])
    console.log(result)
    res.send('Creando Insumo')

})

router.delete('/insumos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('update insumos set activo = false where insumoid = $1 and activo = true', [id]);
        if (result.rowCount > 0) {
            res.status(200).send(`insumos con id: ${id} ha sido actualizado a inactivo.`);
        } else {
            res.status(404).send(`insumos con id: ${id} no encontrado o ya estaba inactivo.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el estado del insumos');
    }
});

router.put('/insumos/:id', async (req, res) => {   
    const { id } = req.params
    const data = req.body

    const {result} = await pool.query('update insumos set color = $1, familia = $2, serie = $3, fechaexpedicion = $4, fechavencimiento = $5 where insumoid = $6', 
        [data.color, data.familia, data.serie, data.fechaexpedicion, data.fechavencimiento, id]
    );

     res.send(data);
});

router.patch('/insumos/:id', async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data);
    const values = Object.values(data);
    
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE insumos SET ${setString} WHERE insumoid = $${fields.length + 1}`;

    try {
        const result = await pool.query(query, [...values, id]);

        if (result.rowCount > 0) {
            res.status(200).send(`insumos con id: ${id} ha sido actualizado.`);
        } else {
            res.status(404).send(`insumos con id: ${id} no encontrado.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error actualizando el detalleventa');
    }
});

export default router;