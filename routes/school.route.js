import express from 'express'
import { promisePool } from '../db/db.js'

const router = express.Router()

//fn to validate latitude and longitude
function isValid(lat, lang){
    if(typeof lat !== 'number' || typeof lang !== 'number') return false
    if(Number.isNaN(lat) || Number.isNaN(lang)) return false

    return lat >= -90 && lat <= 90 && lang >= -180 && lang <= 180
}

//return distance in km
function distanceKM(lat1, lon1, lat2, lon2){
    const toRadius = (deg) => (deg* Math.PI) / 180
    const R = 6371; //earth's radius in km

    const dlat = toRadius(lat2 - lat1)
    const dlon = toRadius(lon2 - lon1)

    const ans = 
    Math.sin(dlat/2) * Math.sin(dlat/2)+
    Math.cos(toRadius(lat1))*
    Math.cos(toRadius(lat2))*
    Math.sin(dlon/2)*
    Math.sin(dlon/2)

    const c = 2 * Math.atan2(Math.sqrt(ans), Math.sqrt(1-ans))
    return R*c
}

//POST : /api/school/addschools
router.post("/addschools", async(req, res) => {
    try{
        const {name, address, latitude, longitude} = req.body
        if(!name || !address || !latitude || !longitude){
            return res.status(400).json({
                success: false,
                error: "all fields are required!"
            })
        }

        if(!name || typeof name !== 'string' || !name.trim()){
            return res.status(400).json({
                success: false,
                error: 'invalid or missing name'
            })
        }

        if(!address || typeof address !== 'string' || !address.trim()){
            return res.status(400).json({
                success: false,
                error: 'invalid or missing address'
            })
        }

        //ensure lat and long are numbers
        const lat = Number(latitude)
        const lang = Number(longitude)
        if(!isValid(lat, lang)){
            return res.status(400).json({
                success: false,
                error: "invalid latitude or longitude"
            })
        }

        const [result] = await promisePool.query(
            `INSERT INTO schools (name, address, latitude, longitude) VALUES (?,?,?,?)`,
            [name.trim(), address.trim(), lat, lang]
        )

        res.status(201).json({
            success: true,
            id: result.insertId,
        })

    }
    catch(error){
        console.error('error while creating schools', error.message)
        res.status(500).json({
            success: false,
            message: 'server error',
            error: error.message

        })
    }
})

router.get("/listschools", async(req, res) => {
    try{
        const userLat = Number(req.query.lat)
        const userlang = Number(req.query.lang)

        if(!isValid(userLat, userlang)){
            return res.status(400).json({
                success: false,
                error: 'lat and lang are required and must be valid number'
            })
        }

        //fetch all schools
        const [rows] = await promisePool.query(`SELECT id, address, latitude, longitude FROM schools`)
        
        const schoolWithDistance = rows.map((r) => {
            const dist = distanceKM(userLat, userlang, Number(r.latitude), Number(r.longitude))
            return {...r, distance_km: Number(dist.toFixed(4))}
        })

        schoolWithDistance.sort((a, b) => a.distance_km - b.distance_km)
        res.status(200).json({
            success: true,
            count: schoolWithDistance.length,
            schools: schoolWithDistance
        })
    }
    catch(error){
        console.error(err)
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
})

//get school by id
router.get("/:id", async(req, res) => {
    try{
        const {id} = req.params
        const [school] = await promisePool.query(`SELECT * FROM schools WHERE id = ?`, [id])
        if(school.length === 0){
            return res.status(404).json({
                success: false,
                message: 'school not found!'
            })
        }

        res.status(200).json({
            success: true,
            message: 'school fetched with id done!',
            data: school[0]
        })
    }
    catch(error){
        console.error('Error fetching school by id:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
        });
    }
})

router.put("/:id", async(req, res) => {
    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;
  
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid input" });
    }
  
    const sql = "UPDATE schools SET name=?, address=?, latitude=?, longitude=? WHERE id=?";
    await promisePool.query(sql, [name, address, latitude, longitude, id], (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "School not found" });
      }
      res.json({ message: "School updated successfully" });
    });
  });

router.delete("/:id", async(req, res) => {
    try{
        const {id} = req.params
        const [school] = await promisePool.query(`SELECT * FROM schools WHERE id=?`, [id])
        if(school.length === 0){
            return res.status(404).json({
                success: false,
                message: 'school not found with this id'
            })
        }

        await promisePool.query(`DELETE FROM schools WHERE id=? `, [id])
        res.status(200).json({
            success: true,
            message: 'school deleted successfully',
        })
    }
    catch(error){
        console.error('Error deleting school by id:', error);
        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: error.message
        });     
    }
    

})
export default router