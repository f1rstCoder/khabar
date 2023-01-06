import React from 'react'
import loading from './loading_red.gif'

const Spinner = () => {

    return (
        <div>
            <img className="my-3 mx-auto" src={loading} alt="Loading..." />
        </div>
    )

}

export default Spinner

