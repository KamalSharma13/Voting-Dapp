import React from 'react'

const Connected = (props) => {
  return (
    <><div className="connected">
        <h1>Welcome to the Voting Dapp</h1>
        <p>Your Account is : <span className="accountname">{props.account}</span> </p>
        <p>Remaining Time : <span className="accountname">{props.remainingTime}</span></p>
{props.showButton ? (
    <p>You already voted</p>
):(
        <div className="inputs">
            <input type="number" placeholder='enter index ' value={props.number} onChange={props.handleNumberChange}  />
            <button className='btn' onClick={props.voteFunction}>Vote</button>
        </div>)}

        <table>
            <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate Name</th>
                    <th>Votes Count</th>
                </tr>
            </thead>
            <tbody>
                {props.candidates.map((candidate,index)=>(
                    
                    <tr key={index}>
                    <td>{candidate.index}</td>
                    <td>{candidate.name}</td>
                    <td className='votecount'>{candidate.voteCount} </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </>
  )
}

export default Connected