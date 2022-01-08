exports.allAccess = (req, res) => {
    res.status(200).send("Public content.");
};
exports.userBoard = (req, res) => {
    res.status(200).send("User content.");
};