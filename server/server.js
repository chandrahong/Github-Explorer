const express = require('express');
var dotenv = require('dotenv').config();
var cors = require('cors')
const fetch = (...args) =>
    import('node-fetch').then(({default : fetch}) => fetch(...args));
var bodyParser = require('body-parser')

const CLIENT_ID = process.env.DEV_CLIENT_ID;
const CLIENT_SECRET = process.env.DEV_CLIENT_SECRET
const PORT = 4000
const AccessPath = "https://github.com/login/oauth/access_token"

var app = express();

app.use(cors());
app.use(bodyParser.json());

//code being passed from the front end
app.get('/getAccessToken', async function (req, res) {
    req.query.code;

    const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code ;

    await fetch(AccessPath + params, {
        method: "POST",
        headers: {
            "Accept": "application/json"
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        res.json(data);
    });
});

//getUserData
//Access token is going to be passed in Authorization header
app.get('/getUserData', async function ( req, res) {
    try{
        req.get("Authorization")
        await fetch("https://api.github.com/user",{
            method: "GET",
            headers:{
                "Authorization": req.get("Authorization"),//Bearer AccessToken
                "Content-Type" : "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json(data);
        });
    }catch(error){
        res.status(500).send('Error retrieving Github user data')
    }
});

app.get('/getRepo', async function (req, res) {
    try{
        req.get("Authorization");
        const username = req.query.username;
        await fetch(`https://api.github.com/users/${username}/repos`,{
            method: "GET",
            headers:{
                "Authorization" : req.get("Authorization"),
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
            res.json(data);
        });
    }catch(error){
        res.status(500).send("Error retrieving Github user repo data")
    }

});

app.get('/searchIssue', async function ( req, res){
    try{
        req.get("Authorization");
        const label = req.query.label;
        const qparams = req.query.query;
        const author = req.query.author;
        let url = `https://api.github.com/search/issues?q=${qparams}+author:${author}+type:issue+state:open`;

        if(label !== "undefined" && label !=="ALL"){
            url =`https://api.github.com/search/issues?q=${qparams}+author:${author}+label:${label}+type:issue+state:open`
        }
        await fetch(url,{
            method: "GET",
            headers: {
                "Authorization" : req.get("Authorization"),
                "Content-Type" : "application/json"
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.items);
            res.json(data);
        })
    }catch(error){
        res.status(500).send("Fail to search issue")
    }
})

app.post('/sendIssue', async function(req, res) {
    try{
        const { owner, repo, ...issuesData } = req.body
        console.log(issuesData)
        req.get("Authorization");
        console.log(owner);
        console.log(repo);
        await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`,{
            method: "POST",
            headers:{
                "Authorization": req.get("Authorization"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(issuesData)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json(data);
        });
    }catch(error){
        res.status(500).send("Fail to create the issue")
    }
});

app.get('/getIssues', async function(req, res) {
    try{
        const username = req.query.user;
        const repo = req.query.repo;
        const label = req.query.label;
        const per_page = req.query.per_page;
        const page= req.query.page;
        let pageParameters;
        if(page === "undefined"){
            pageParameters = `?per_page=${per_page}&page=${page}`
        }else{
            pageParameters = `?page=${page}`
        }
        const bearerToken = req.get("Authorization");
      
        if(repo && label === undefined){
            await fetch(`https://api.github.com/repos/${username}/${repo}/issues`,{
                method: "GET",
                headers:{
                    "Authorization" : bearerToken,
                    "Content-Type" : "application/json"
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
                res.json((data));
            })
        };
        if(repo && label){
            if(label === "ALL"){
                await fetch(`https://api.github.com/repos/${username}/${repo}/issues?page=${page}&per_page=${per_page}`,{
                method: "GET",
                headers:{
                    "Authorization" : bearerToken,
                    "Content-Type" : "application/json"
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
                res.json((data));
            })

            }else{
                await fetch(`https://api.github.com/repos/${username}/${repo}/issues?labels=${label}&page=${page}&per_page=${per_page}`,{
                method: "GET",
                headers:{
                    "Authorization" : bearerToken,
                    "Content-Type" : "application/json"
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
                res.json((data));
            })
            }
        };
    }catch(error){
        res.status(500).send("Fail to get Issues")
    }
})

app.patch('/deleteIssue', async function(req,res){
    try{
        const {owner, repo, number , ...deleteIssues} = req.body;
        console.log(owner);
        console.log(repo);
        console.log(number);
        console.log(deleteIssues);
        req.get("Authorization")
        await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`,{
            method: 'PATCH',
            headers:{
                "Authorization" : req.get("Authorization"),
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(deleteIssues)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json((data))
        })
    }catch(error){
        res.status(500).send("Fail to delete Issues")
    }
})

app.patch('/updateIssue', async function(req,res){
    try{
        const updateIssues = req.body;
        const owner = req.query.owner;
        const repo = req.query.repo;
        const number = req.query.number;
        req.get("Authorization")
        await fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${number}`,{
            method: 'PATCH',
            headers:{
                "Authorization" : req.get("Authorization"),
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(updateIssues)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            res.json((data))
        })
    }catch(error){
        res.status(500).send("Fail to updat Issues")
    }
})


app.listen(PORT,() => {
    console.log(
   `The Server is running at 4000`);
});

module.exports = app;