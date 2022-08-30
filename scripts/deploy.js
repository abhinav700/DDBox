async function main() {
	const DDBox = await ethers.getContractFactory("DDBox");
	const contract = await DDBox.deploy();
	console.log("Contract deployed at:", contract.address);
}
// 0xac0974bec39a17e36ba4a6b4d238ff944bacb478
main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });