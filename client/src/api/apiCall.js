
const accessToken = localStorage.getItem("accessToken");
const serverUrl = 'http://localhost:4000'

export const getUserData = async function (accessToken){
  console.log(accessToken);
  const response = await fetch(serverUrl + '/getUserData',{
      method:"GET",
      headers:{
        "Authorization" : `Bearer ${accessToken}`,
        "Content-Type" : "application/json"
      },
  })
  const data = await response.json();
  console.log(data);
  return data;
}

export const fetchRepositories = async function(username, accessToken) {
  if(accessToken === undefined){
    accessToken = localStorage.getItem("accessToken")
  }
  const response = await fetch (serverUrl + "/getRepo?username=" + username,{
    method: "GET",
    headers: {
      "Authorization" : `Bearer ${accessToken}`,
      "Content-Type" : "application/json"
    }
  })
  const data = await response.json();
  return data;
}

export const getRepoIssues = async function(parameters,pageNumber) {
  let pageParameters;
  if(pageNumber){
    pageParameters = `&page=${pageNumber}&per_page=10`
  } else {
    pageParameters = '&per_page=10'
  }
  const response = await fetch(serverUrl + '/getIssues' + parameters + pageParameters,{
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type" : "application/json"
    }
  })
  const data = response.json();
  return data;
}

export const DeleteIssues = async function(deleteIssues){
    await fetch(serverUrl + '/deleteIssue',{
        method: "PATCH",
        headers:{
            "Authorization" : `Bearer ${accessToken}`,
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(deleteIssues),
    }).then((response) => {
        return response.json();
    }).then((data)=> {
        console.log(data);
    })
}

export const UpdateIssues = async function(updateIssues, user, repoChoosen, issueNumber ){
  const params = `?owner=${user}&repo=${repoChoosen}&number=${issueNumber}`
  await fetch(serverUrl + '/updateIssue' + params,{
      method: "PATCH",
      headers:{
          "Authorization" : `Bearer ${accessToken}`,
          "Content-Type" : "application/json",
      },
      body: JSON.stringify(updateIssues),
  }).then((response) => {
      return response.json();
  }).then((data)=> {
      console.log(data);
  })
}

export const UpdateLabel = async function(label){
  await fetch(serverUrl + '/updateIssue',{
      method: "PATCH",
      headers:{
          "Authorization" : `Bearer ${accessToken}`,
          "Content-Type" : "application/json",
      },
      body: JSON.stringify(label),
  }).then((response) => {
      return response.json();
  }).then((data)=> {
      console.log(data);
  })
}

export const SendIssues = async function (issuesData) {
    await fetch (serverUrl + '/sendIssue',{
      method: "POST",
      headers: {
        "Authorization" : `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(issuesData)
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
    })
}

export const SearchIssues = async function(query, username , label) {
    let params;
    if(label !== null){
      params = "?query=" + query + "&author=" + username + "&label=" + label;
    } else {
      params = "?query=" + query + "&author=" + username;
    }
    console.log(params);
    const response = await fetch( serverUrl + '/searchIssue' + params,{
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${accessToken}`,
        "Content-Type" : "application/json"
      },
    })
    const data = await response.json();
    return data.items;

}