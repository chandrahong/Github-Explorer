import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getRepoIssues } from '../../api/apiCall';
import { selectFilter } from '../../redux/reducers/filterSlice';
import { set_issue } from '../../redux/reducers/issueSlice';

export default function useInfiniteScroll(parameters, pageNumber){
    const dispatch = useDispatch();
    const label = useSelector(selectFilter)
    const [loader, setLoader] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [issueArray , setIssueArray] = useState([]);

    useEffect(() => {
        setIssueArray([])
    },[label])

    useEffect(() => {
        console.log(parameters)
        console.log("hey" + pageNumber)
        setLoader(true)
        getRepoIssues(parameters, pageNumber)
            .then(data => {
                console.log(data)
                setIssueArray(prevData => {
                    return [...prevData , ...data]
                })
                console.log(issueArray)
                setHasMore(data.length > 0)
                setLoader(false)
            })
        
        dispatch(set_issue(issueArray))
    },[parameters, pageNumber])

    return { loader, hasMore }
}