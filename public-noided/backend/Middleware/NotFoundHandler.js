export default async function NotFoundHandler(req, res, next){
    res.status(404).send();
}