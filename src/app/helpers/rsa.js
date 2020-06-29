/* global _node */

const areRsaKeys = async () => await _node.areRsaKeys();

const loadRSAPaths = async () => await _node.loadRSAPaths();

export { areRsaKeys, loadRSAPaths };
