
const accessToken = localStorage.getItem("accessToken");
const liveUrl = 'http://localhost:4000'
const serverUrl = 'https://github-explorer-server.vercel.app'

export const getUserData = async function (accessToken){
  const response = await fetch(serverUrl + '/getUserData',{
      method:"GET",
      headers:{
        "Authorization" : `Bearer ${accessToken}`,
        "Content-Type" : "application/json"
      },
  })
  const data = await response.json();
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
  if(parameters){
    if(pageNumber && pageNumber > 1){
      pageParameters = `&page=${pageNumber}&per_page=10`
    } else {
      pageParameters = `&page=${1}&per_page=10`
    }
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
    const response = await fetch(serverUrl + '/deleteIssue',{
        method: "PATCH",
        headers:{
            "Authorization" : `Bearer ${accessToken}`,
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(deleteIssues),
    })
    const data = response.json();
    return data;
}

export const UpdateIssues = async function(updateIssues, user, repoChoosen, issueNumber ){
  const params = `?owner=${user}&repo=${repoChoosen}&number=${issueNumber}`
  const response = await fetch(serverUrl + '/updateIssue' + params,{
      method: "PATCH",
      headers:{
          "Authorization" : `Bearer ${accessToken}`,
          "Content-Type" : "application/json",
      },
      body: JSON.stringify(updateIssues),
  })

  const data = response.json();
  return data;
}

export const UpdateLabel = async function(label){
  const response = await fetch(serverUrl + '/updateIssue',{
      method: "PATCH",
      headers:{
          "Authorization" : `Bearer ${accessToken}`,
          "Content-Type" : "application/json",
      },
      body: JSON.stringify(label),
  })

  const data = response.json();
  return data;
}

export const SendIssues = async function (issuesData) {
    const response = await fetch (serverUrl + '/sendIssue',{
      method: "POST",
      headers: {
        "Authorization" : `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(issuesData)
    })

    const data = response.json();
    return data;
}

export const SearchIssues = async function(query, username , label) {
    let params;
    if(label !== null){

      if(label == "ASC" || label == "DESC"){
        params = "?query=" + query + "&author=" + username + "&order=" + label
      }else{
        params = "?query=" + query + "&author=" + username + "&label=" + label
      };
    } else {
      params = "?query=" + query + "&author=" + username;
    }

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