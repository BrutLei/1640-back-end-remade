export const handleHello = (req, res) => {
    return res.status(200).send('Hello World from controller');
}