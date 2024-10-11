import mysql from 'mysql2';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(express.json());

const sql = mysql.createConnection({
    user: "root",
    host: 'localhost',
    password: 'Sohaib210886sql',
    database: 'Orgdata'
});

sql.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Successfully connected to the database');
    }
});

app.get('/', (req, res) => {
    const query = "SELECT * FROM members";
    sql.query(query, (err, result) => {
        if (err) return res.json({ msg: "Error fetching members", error: err });

        const modifiedResult = result.map(member => ({
            ...member,
            id: member.id.toString()
        }));

        return res.json(modifiedResult);
    });
});
function getLastId() {
    return new Promise((resolve, reject) => {
        const query1 = `SELECT MAX(CAST(id AS UNSIGNED)) AS lastId FROM MEMBERS;`;
        
        
        sql.query(query1, (err, result) => {
            if (err) return reject(err);  
            
            const lastId = result[0]?.lastId || null; 
            console.log("lastid",lastId)
            resolve(lastId);  
        });
    });
}



app.post('/api/members', async (req, res) => {
    try {
        
        const id = await getLastId();
        console.log("id",id)
        const newId = (parseInt(id, 10) + 1).toString();
        console.log("new",newId);  

        const { BPS, memberName, designation, Branch, parentId, imageLink } = req.body;
        const initialChildrenIds = JSON.stringify([]);
        const query = `INSERT INTO members (id, BPS, memberName, designation, Branch, parentId, childrenIds, imageLink) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        sql.query(query, [
            newId, 
            BPS, 
            memberName, 
            designation || null,  
            Branch || null, 
            parentId || null, 
            initialChildrenIds,  
            imageLink || null
        ], (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
                return res.status(500).json({ msg: "Error creating member", error: err });
            }
            if(parentId!=null){
                const query2 = `UPDATE MEMBERS SET childrenIds = JSON_ARRAY_APPEND(childrenIds, '$', ?) WHERE id = ?;`;
                sql.query(query2,[newId, parentId],(err,result1)=>{
                    if(err)
                    {return res.status(500).json({Msg:"Error in server"})}
                }
                )
            }
           
            return res.json({ msg: "Member added successfully", result });
        });

    } catch (err) {
        console.error('Error creating member:', err);
        return res.status(500).json({ msg: "Internal server error", error: err });
    }
});



app.put('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const { BPS, memberName, designation, Branch, parentId, imageLink } = req.body;
    
    const getParentQuery = "SELECT parentId FROM members WHERE id = ?";
    sql.query(getParentQuery, [id], (err, result) => {
        if (err) return res.status(500).json({ msg: "Error fetching current parentId", error: err });

        const currentParentId = result[0]?.parentId;

        if (currentParentId !== parentId) {
            if (currentParentId) {
                const removeChildQuery = `
                    UPDATE members 
                    SET childrenIds = JSON_REMOVE(childrenIds, JSON_UNQUOTE(JSON_SEARCH(childrenIds, 'one', ?))) 
                    WHERE id = ?`;
                sql.query(removeChildQuery, [id, currentParentId], (err, result) => {
                    if (err) return res.status(500).json({ msg: "Error removing member from previous parent's childrenIds", error: err });
                });
            }

            if (parentId) {
                const addChildQuery = `
                    UPDATE members 
                    SET childrenIds = JSON_ARRAY_APPEND(childrenIds, '$', ?) 
                    WHERE id = ?`;
                sql.query(addChildQuery, [id, parentId], (err, result) => {
                    if (err) return res.status(500).json({ msg: "Error adding member to new parent's childrenIds", error: err });
                });
            }
        }

        const updateMemberQuery = "UPDATE members SET BPS = ?, memberName = ?, designation = ?, Branch = ?, parentId = ?, imageLink = ? WHERE id = ?";
        sql.query(updateMemberQuery, [BPS, memberName, designation, Branch, parentId || null, imageLink, id], (err, result) => {
            if (err) return res.status(500).json({ msg: "Error updating member", error: err });
            return res.json({ msg: "Member updated successfully", result });
        });
    });
});

app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;

    const findParentQuery = "SELECT parentId FROM members WHERE id = ?";
    sql.query(findParentQuery, [id], (err, result) => {
        if (err) return res.status(500).json({ msg: "Error finding parent", error: err });

        const parentId = result[0]?.parentId;
        if (parentId) {
            const updateParentQuery = `UPDATE members 
                                       SET childrenIds = JSON_REMOVE(childrenIds, JSON_UNQUOTE(JSON_SEARCH(childrenIds, 'one', ?))) 
                                       WHERE id = ?`;
            sql.query(updateParentQuery, [id, parentId], (err, result) => {
                if (err) return res.status(500).json({ msg: "Error updating parent", error: err });

                const deleteQuery = "DELETE FROM members WHERE id = ?";
                sql.query(deleteQuery, [id], (err, result) => {
                    if (err) return res.status(500).json({ msg: "Error deleting member", error: err });
                    return res.json({ msg: "Member deleted successfully and parent updated", result });
                });
            });
        } else {
            const deleteQuery = "DELETE FROM members WHERE id = ?";
            sql.query(deleteQuery, [id], (err, result) => {
                if (err) return res.status(500).json({ msg: "Error deleting member", error: err });
                return res.json({ msg: "Member deleted successfully", result });
            });
        }
    });
});


app.listen(8080, () => {
    console.log("Server running on port 8080");
});




