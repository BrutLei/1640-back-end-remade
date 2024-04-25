import express from 'express';
import { fetchAllTopic, createNewTopic, fetchTopicForFaculty, fetchTopicById } from '../controller/topicController';

const topic_route = express.Router();

topic_route.get('/', fetchAllTopic);
topic_route.get('/:id', fetchTopicById);
topic_route.get('/faculty/:id', fetchTopicForFaculty);
topic_route.post('/create', createNewTopic);

export default topic_route;
