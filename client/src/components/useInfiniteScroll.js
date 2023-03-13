import {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import { getRepoIssues } from '../api/apiCall';
import { set_issue } from '../redux/reducers/issueSlice';

export default function(parameters, pageNumber){
    console.log(pageNumber)
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [issueArray , setIssueArray] = useState([]);

    useEffect(() => {
        setIssueArray([])
    },[parameters])

    useEffect(() => {
        setLoading(true)
        getRepoIssues(parameters, pageNumber)
            .then(data => {
                setIssueArray(prevData => [...prevData, ...data])
                console.log(issueArray)
                setHasMore(data.length > 0)
                setLoading(false)
            })
    })

    return( loading, hasMore)
}