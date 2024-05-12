import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

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
        bug.createdAt = new ObjectId(bug._id).getTimestamp()
        return bug
    } catch (err) {
        logger.error(`Cannot find bug ${bugId}`, err)
        throw err
    }
}

async function remove(bugId) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.deleteOne({ _id: new ObjectId(bugId) })
    } catch (err) {
        logger.error(`Cannot remove bug ${bugId}`, err)
        throw err
    }
}

async function add(bug) {
    try {
        const collection = await dbService.getCollection('bug')
        await collection.insertOne(bug)
        return bug
    } catch (err) {
        logger.error('Cannot insert bug', err)
        throw err
    }
}

async function update(bug) {
    try {
        const bugToSave = {
            title: bug.title,
            desc: bug.desc,
            severity: bug.severity
        }
        const collection = await dbService.getCollection('bug')
        await collection.updateOne({ _id: new ObjectId(bug._id) }, { $set: bugToSave })
        return bug
    } catch (err) {
        logger.error(`Cannot update bug ${bug._id}`, err)
        throw err
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
