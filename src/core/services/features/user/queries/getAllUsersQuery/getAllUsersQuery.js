class GetAllUsersQuery {
    constructor(pageSize = 10, lastVisible = null) {
        this.pageSize = pageSize;
        this.lastVisible = lastVisible;
    }
}

module.exports = GetAllUsersQuery;
