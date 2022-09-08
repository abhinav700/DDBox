import React, { useEffect } from 'react';

let count = 0;
const DisplayTable = (props) => {
    useEffect(() => {
        if (props.files != undefined) {

            console.log(props.files)
        }
    }, [props.files])

    return (
        <>

            {

              }
        </>
    )
}

export default DisplayTable