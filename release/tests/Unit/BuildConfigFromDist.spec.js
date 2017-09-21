'use strict';
const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
describe('BuildConfigFromDist', () => {
    var { BuildConfigFromDist } = require(path.join('..', '..', 'src', 'BuildConfigFromDist'));
    var existsFileSyncMock;
    var writeFileSyncMock;
    var readFileSyncMock;
    var distBuild;
    beforeEach(function () {
        distBuild = new BuildConfigFromDist();
        existsFileSyncMock = sinon.stub(fs, 'existsSync');
        writeFileSyncMock = sinon.stub(fs, 'writeFileSync');
        readFileSyncMock = sinon.stub(fs, 'readFileSync');
    });
    afterEach(function () {
        existsFileSyncMock.restore();
        writeFileSyncMock.restore();
        readFileSyncMock.restore();
    });
    describe('Tests "merge" function', () => {
        it('Should throw exception when given file is not exist', () => {
            existsFileSyncMock.withArgs('file.dist.js').returns(false);
            expect(() => {
                distBuild.merge('file.dist.js');
            }).to.throw(Error, BuildConfigFromDist.errorMessages.fileNotExist + 'file.dist.js');
        });
        it('Should throw exception when no valid json given', () => {
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            readFileSyncMock.returns('{');
            expect(() => {
                distBuild.merge('file.dist.js');
            }).to.throw(Error, BuildConfigFromDist.errorMessages.notValidJsonFile + 'file.dist.js');
        });
        it('Should throw exception when given file name does not contain the "dist" word', () => {
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.returns('{}');
            expect(() => {
                distBuild.merge('file.js');
            }).to.throw(Error, BuildConfigFromDist.errorMessages.notValidDistFileName + 'file.js');
        });
        it('Should throw exception when output file has not valid json', () => {
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns('{}');
            readFileSyncMock.withArgs('file.js').returns('{');
            expect(() => {
                distBuild.merge('file.dist.js');
            }).to.throw(Error, BuildConfigFromDist.errorMessages.notValidJsonFile + 'file.js');
        });
        it('Should correct merge dist and user config', () => {
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns(JSON.stringify({
                oldKey: "standard",
                newKey: "standard",
            }));
            readFileSyncMock.withArgs('file.js').returns(JSON.stringify({
                oldKey: "custom"
            }));
            distBuild.merge('file.dist.js');
            expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                oldKey: "custom",
                newKey: "standard"
            });
        });
        it("Should correct merge dist and user config when do not have user config file", () => {
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns(JSON.stringify({
                oldKey: "standard",
                newKey: "standard",
            }));
            existsFileSyncMock.withArgs('file.js').returns(false);
            distBuild.merge('file.dist.js');
            expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                oldKey: "standard",
                newKey: "standard"
            });
        });
    });
});
//# sourceMappingURL=BuildConfigFromDist.spec.js.map