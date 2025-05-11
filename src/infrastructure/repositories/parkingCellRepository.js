const db = require('../database/firebaseService');
const ParkingCellMapper = require('../../core/services/mapping/parkingCellMapper');

class ParkingCellRepository {
    constructor() {
        this.collection = db.collection('parkingCells');
    }

    async bulkStatusUpdate(cells) {
        const results = [];

        for (const cell of cells) {
            const { idStatic, state } = cell;
            try {
                const updatedId = await this.upsertByStaticId(idStatic, state);
                results.push({ idStatic, status: 'success', docId: updatedId });
            } catch (error) {
                console.error(`Error actualizando celda ${idStatic}:`, error);
                results.push({ idStatic, status: 'error', error: error.message });
            }
        }

        return results;
    }

    async upsertByStaticId(idStatic, newState, reservationDetails = null) {
        const snapshot = await this.collection.where('idStatic', '==', idStatic).limit(1).get();

        const now = new Date();
        const updateData = {
            state: newState,
            lastModifiedDate: now,
            lastModifiedBy: 'system'
        };

        if (newState === 'reservado' && reservationDetails) {
            updateData.reservationDetails = reservationDetails;
        }

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await this.collection.doc(doc.id).update(updateData);
            return doc.id;
        } else {
            const data = {
                idStatic,
                state: newState,
                createdDate: now,
                createdBy: 'system',
                lastModifiedDate: now,
                lastModifiedBy: 'system'
            };

            if (newState === 'reservado' && reservationDetails) {
                data.reservationDetails = reservationDetails;
            }

            const docRef = await this.collection.add(data);
            return docRef.id;
        }
    }


    async getByIdStatic(idStatic) {
        const snapshot = await this.collection.where('idStatic', '==', idStatic).limit(1).get();
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return ParkingCellMapper.toDomain({ ...doc.data(), id: doc.id });
        }
        return null;
    }


    async getAll() {
        const snapshot = await this.collection.get();
        const results = [];
        snapshot.forEach(doc => {
            results.push(ParkingCellMapper.toDomain({ ...doc.data(), id: doc.id }));
        });
        return results;
    }
}

module.exports = ParkingCellRepository;