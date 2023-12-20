import { bugServiceFront } from '../services/bug.service.js'
import { BugList } from "../cmps/BugList";
// import { userService } from "../services/user.service";
const { useState, useEffect } = React

export function UserDetails() {
    const [bugs, setBugs] = useState(null)

    useEffect(() => {
        loadBugs()
        return () => {
            console.log('Bye Bye')
        }
    }, [])


    function loadBugs() {
        const params = { filterByUser: true }

        bugServiceFront.query(params)
            .then(bugs => setBugs(bugs))
            .catch(err => console.log('err:', err))
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugServiceFront
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
                loadBugs()
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onRemoveBug(bugId) {
        bugServiceFront
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }


    return (
        <section>
          {/* {bugs && ( */}
            <BugList
                bugs={bugs}
                onRemoveBug={onRemoveBug}
                onEditBug={onEditBug}
            />
        {/* )} */}
        </section>
    )
}