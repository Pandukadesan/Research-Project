// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MileageLedger {

    struct MileageRecord {
        string engineNumber;
        string chassisNumber;
        string serviceNumber;   // ✅ NEW
        uint256 mileage;
        uint256 timestamp;
    }

    MileageRecord[] public records;

    event MileageStored(
        string engineNumber,
        string chassisNumber,
        string serviceNumber,   // ✅ NEW
        uint256 mileage,
        uint256 timestamp
    );

    function storeMileage(
        string memory _engineNumber,
        string memory _chassisNumber,
        string memory _serviceNumber, // ✅ NEW
        uint256 _mileage
    ) public {
        records.push(
            MileageRecord(
                _engineNumber,
                _chassisNumber,
                _serviceNumber,
                _mileage,
                block.timestamp
            )
        );

        emit MileageStored(
            _engineNumber,
            _chassisNumber,
            _serviceNumber,
            _mileage,
            block.timestamp
        );
    }

    function getRecordCount() public view returns (uint256) {
        return records.length;
    }
}
