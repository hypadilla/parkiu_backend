class BaseDomainModel {
    constructor({ id, createdDate, createdBy, lastModifiedDate, lastModifiedBy }) {
        this.id = id;
        this.createdDate = createdDate || new Date();
        this.createdBy = createdBy;
        this.lastModifiedDate = lastModifiedDate || new Date();
        this.lastModifiedBy = lastModifiedBy;
    }
}

module.exports = BaseDomainModel;
