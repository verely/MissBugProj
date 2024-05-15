import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'
import { UnauthorizedError } from '../auth/auth.error.js'

async function query(filterBy={title:''}) {
    // console.log(filterBy);
    try {
        const criteria = {
            title: { $regex: filterBy.title, $options: 'i' }
        }
        const collection = await dbService.getCollection('bug')
        var bugs = await collection.find(criteria).toArray()
        return bugs
    } catch (err) {
        logger.error(`Error occurred while search query: ${err}. Filter parameters used: ${filterBy.title}`);
        throw err
    }
}

async function getById(bugId) {
    try {
        // console.log(bugId)
        const collection = await dbService.getCollection('bug')
        const bug = await collection.findOne({ _id: new ObjectId(bugId) })
        return bug
    } catch (err) {
        logger.error(`Cannot find bug ${bugId}`, err)
        throw err
    }
}

async function add(bug, loggedInUser) {
    try {
        const bugToSave = {
            title: bug.title,
            desc: bug.desc,
            severity: +bug.severity,
            owner: loggedInUser
        }
        const collection = await dbService.getCollection('bug')
        const insertionResult = await collection.insertOne(bugToSave)
        if (insertionResult.acknowledged) {
            const insertedBug = {
                ...bugToSave,
                _id: insertionResult.insertedId,
                createdAt: new ObjectId(insertionResult.insertedId).getTimestamp().getTime()
            };
            return insertedBug;
        } else {
            throw new Error('Failed to insert bug');
        }
    } catch (err) {
        logger.error('Cannot insert bug', err)
        throw err
    }
}

async function update(bug, loggedInUser) {
    try {
        if (!(await hasPermission(bug._id, loggedInUser))) {
            throw new UnauthorizedError("Only admin or bug owner can update it")
        }

        const bugToSave = {
            title: bug.title,
            desc: bug.desc,
            severity: +bug.severity
        }
        const collection = await dbService.getCollection('bug')
        const updateResult = await collection.updateOne({ _id: new ObjectId(bug._id) }, { $set: bugToSave })
        if (updateResult.acknowledged) {
            const updatedBug = {
                ...bugToSave
            };
            return updatedBug;
        } else {
            throw new Error('Failed to update bug');
        }
    } catch (err) {
        logger.error(`Cannot update bug ${bug._id}`, err)
        throw err
    }
}

async function remove(bugId, loggedInUser) {
    try {
        if (!(await hasPermission(bugId, loggedInUser))) {
            throw new UnauthorizedError("Only admin or bug owner can remove it")
        }

        const collection = await dbService.getCollection('bug')
        await collection.deleteOne({ _id: new ObjectId(bugId) })
    }
    catch (err) {
        logger.error(`Cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function hasPermission(bugId, loggedInUser) {
    try {
        if (loggedInUser.isAdmin)
        return true

        const bug = await getById(bugId);
        return bug.owner._id === loggedInUser._id;
    } catch (err) {
        logger.error(`Error checking bug permission for bug ${bugId}`, err);
        throw err;
    }
}



async function addBugLabels(bugId, label) {
    try {
        label.id = utilService.makeId()
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $push: { labels: label } })
        return label
    } catch (err) {
        logger.error(`Cannot add bug label ${bugId}`, err)
        throw err
    }
}

async function removeBugLabels(bugId, labelId) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: new ObjectId(bugId) }, { $pull: { labels: {id: labelId} } })
        return labelId
    } catch (err) {
        logger.error(`cannot remove bug label ${bugId}`, err)
        throw err
    }
}

export const bugService = {
    query,
    getById,
    remove,
    add,
    update,
    addBugLabels,
    removeBugLabels
}
