const dbService = require('../../services/db.service')
const utilService = require('../../services/util.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
    // const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('boards')
        var boards = await collection.find().toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        const board = await collection.findOne({ _id: ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = {
            _id: ObjectId(board._id),
            title: board.title,
            subtitle: board.subtitle,
            cellTypes: board.cellTypes,
            // isFavorite: board.isFavorite,
            statusLabels: board.statusLabels,
            members: board.members,
            groups: board.groups,
            colors: board.colors,
            createdBy: board.createdBy,
            createdAt: board.createdAt,
            priorityLabels: board.priorityLabels,
            activities: board.activities,
            tags: board.tags,
        }
        const collection = await dbService.getCollection('boards')
        await collection.updateOne(
            { _id: boardToSave._id },
            { $set: boardToSave }
        )
        return boardToSave
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(currUser) {
    try {
        const boardToAdd = _getNewBoard(currUser)
        const collection = await dbService.getCollection('boards')
        const board = await collection.insertOne(boardToAdd)
        return board[0]
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('boards')
        await collection.deleteOne({ _id: ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

module.exports = {
    query,
    add,
    getById,
    remove,
    update,
}

// function _buildCriteria(filterBy) {
//     let criteria = {}
//     if (filterBy) {
//         criteria = { 'title': { $regex: filterBy, $options: 'i' } }
//     }
// }


function _getNewBoard() {
    return {
      title: 'New Board',
      statuses: [
        { name: '', color: '#0C4C4C4' },
        { name: 'Not Assignee', color: '#7F5347', hover: '#9E807A' },
        { name: 'Working On It', color: '#FDAB3D', hover: '#F6BE73' },
        { name: 'Bug', color: '#E2445C' },
        { name: 'Wating For Dev', color: '#784BD1', hover: '#997BDA' },
        { name: 'Wating For Deploy', color: '#037F4C' },
        { name: 'Wating For QA', color: '#FF158A', hover: '#F755A9' },
        { name: 'Done', color: '#00C875', hover: '#45D29A' },
      ],
      priority: [
        { name: 'High', color: '#BB3354' },
        { name: 'Medium', color: '#D974B0' },
        { name: 'Low', color: '#2B76E5' },
        { name: 'Done', color: '#00C875', hover: '#45D29A' },
        { name: '', color: '#0C4C4C4' },
      ],
      createdAt: new Date(),
      createdBy: {
        _id: 'u111',
        fullname: 'Guest',
        imgUrl: 'imgs/mini-user-imgs/u111.png',
      },
      members: [
        {
          _id: 'u111',
          fullname: 'Guest',
          imgUrl: 'imgs/mini-user-imgs/u111.png',
        },
      ],
      activities: [],
      groups: [],
      cmpsOrder: [
        'Assignee',
        'Status',
        'Priority',
        'Deadline',
        'Working Hours',
        'Last Updated',
      ],
    }
  }