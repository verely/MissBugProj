import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { UnauthorizedError } from '../auth/auth.error.js'

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('msg')
        //const messages = await collection.find(criteria).toArray()
        var messages = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutBugId',
                    from: 'bug',
                    foreignField: '_id',
                    as: 'aboutBug'
                }
            },
            {
                $unwind: '$aboutBug'
            }
        ]).toArray()

        return messages
    } catch (err) {
        logger.error(`Error occurred while search query: ${err}.`);
        throw err
    }
}

async function getById(msgId) {
    try {
        // console.log(msgId)
        const collection = await dbService.getCollection('msg')
        const msg = await collection.findOne({ _id: ObjectId.createFromHexString(msgId) })
        return msg
    } catch (err) {
        logger.error(`Cannot find msg ${msgId}`, err)
        throw err
    }
}

async function add(msg, loggedInUser) {
    try {
        const msgToSave = {
            txt: msg.txt,
            aboutBugId: ObjectId.createFromHexString(msg.aboutBugId),
            byUserId: ObjectId.createFromHexString(loggedInUser._id)
        }

        const collection = await dbService.getCollection('msg')
        const insertionResult = await collection.insertOne(msgToSave)
        if (insertionResult.acknowledged) {

            const insertedId = insertionResult.insertedId
            console.log(`createFromHexString: ${insertedId.getTimestamp().getTime()}`)

            const insertedMsg = {
                ...msgToSave,
                _id: insertedId,
                createdAt: insertedId.getTimestamp().getTime()
            };
            console.log(insertedMsg)
            return insertedMsg;
        } else {
            throw new Error('Failed to insert msg');
        }
    } catch (err) {
        logger.error('Cannot insert msg', err)
        throw err
    }
}

async function update(msg, loggedInUser) {
    try {
        if (!(await hasPermission(msg._id, loggedInUser))) {
            throw new UnauthorizedError("Only admin or msg owner can update it")
        }

        const msgToSave = {
            txt: msg.txt,
        }
        const collection = await dbService.getCollection('msg')
        const updateResult = await collection.updateOne({ _id: ObjectId.createFromHexString(msg._id) }, { $set: msgToSave })
        if (updateResult.acknowledged) {
            const updatedMsg = {
                ...msgToSave
            };
            return updatedMsg;
        } else {
            throw new Error('Failed to update msg');
        }
    } catch (err) {
        logger.error(`Cannot update msg ${msg._id}`, err)
        throw err
    }
}

async function remove(msgId) {
    try {
        const collection = await dbService.getCollection('msg')
        await collection.deleteOne({ _id: ObjectId.createFromHexString(msgId) })
    }
    catch (err) {
        logger.error(`Cannot remove msg ${msgId}`, err)
        throw err
    }
}

async function hasPermission(msgId, loggedInUser) {
    try {
        if (loggedInUser.isAdmin)
        return true

        const msg = await getById(msgId);
        return msg.owner._id === loggedInUser._id;
    } catch (err) {
        logger.error(`Error checking msg permission for msg ${msgId}`, err);
        throw err;
    }
}

// function _buildCriteria(filterBy) {
//     const criteria = {}
//     if (filterBy.byUserId) criteria.byUserId = ObjectId(filterBy.byUserId)
//     return criteria
// }

export const msgService = {
    query,
    getById,
    remove,
    add,
    update
}
