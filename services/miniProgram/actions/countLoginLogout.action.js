const _ = require("lodash");
const { MoleculerError } = require("moleculer").Errors;
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
});

module.exports = async function (ctx) {
	try {
		if (_.get(ctx, "params.params.month", null) === null) {
			return {
				code: 1001,
				message: "Thất bại",
			};
		}
		const month = parseInt(ctx.params.params.month);
		// console.log("tháng", month);
		// console.log("start", new Date(Date.UTC(2022, month - 1)));
		// console.log("end", new Date(Date.UTC(2022, month)));

		let dataLogin = await this.broker.call(
			"v1.MiniProgramUserTokenModel.aggregate",
			[
				[
					{
						$match: {
							createdAt: {
								$gte: new Date(Date.UTC(2022, month - 1)),
								$lt: new Date(Date.UTC(2022, month)),
							},
						},
					},
					{
						$group: {
							_id: {
								userId: "$userId",
							},
							countLogin: {
								$sum: 1,
							},
						},
					},
					{
						$lookup: {
							from: "Service_MiniProgramUser",
							localField: "_id.userId",
							foreignField: "id",
							as: "user_info",
						},
					},
					{ $unwind: "$user_info" },
					{
						$project: {
							_id: 0,
							userId: "$user_info.id",
							name: "$user_info.name",
							email: "$user_info.email",
							countLogin: 1,
						},
					},
					{
						$sort: { userId: 1 },
					},
				],
			]
		);
		console.log("dataLogin", dataLogin.length);

		let dataLogout = await this.broker.call(
			"v1.MiniProgramUserTokenModel.aggregate",
			[
				[
					{
						$match: {
							$or: [
								{
									logoutTime: {
										$gte: new Date(
											Date.UTC(2022, month - 1)
										),
										$lt: new Date(Date.UTC(2022, month)),
									},
								},
								{
									logoutTime: null,
								},
							],
						},
					},
					{
						$group: {
							_id: {
								userId: "$userId",
								// month: {
								// 	$month: "$login",
								// },
							},
							countLogout: {
								$sum: {
									$cond: [
										{
											$eq: ["$logoutTime", null],
										},
										0,
										1,
									],
								},
							},
						},
					},
					{
						$lookup: {
							from: "Service_MiniProgramUser",
							localField: "_id.userId",
							foreignField: "id",
							as: "user_info",
						},
					},
					{ $unwind: "$user_info" },
					{
						$project: {
							_id: 0,
							userId: "$user_info.id",
							name: "$user_info.name",
							email: "$user_info.email",
							countLogout: 1,
						},
					},
					{
						$sort: { userId: 1 },
					},
				],
			]
		);

		//console.log("dataLogout", dataLogout);

		dataLogout.forEach((i) => {
			i.countLogin = 0;
			dataLogin.forEach((j) => {
				if (i.userId === j.userId && i.countLogin === 0) {
					i.countLogin = j.countLogin;
				}
			});
		});
		const data = dataLogout.filter((i) => {
			if (i.countLogin !== 0 || i.countLogout !== 0) {
				return i;
			}
		});

		if (data) {
			console.log("vào tạo excel");
			const workbook = new ExcelJS.Workbook();
			workbook.views = [
				{
					x: 0,
					y: 0,
					width: 10000,
					height: 20000,
					firstSheet: 0,
					activeTab: 0,
					visibility: "visible",
				},
			];
			const sheet = workbook.addWorksheet("Overview", {
				views: [{ showGridLines: true, zoomScale: 100 }],
			});

			sheet.getRow(1).height = 35;
			sheet.mergeCells("A1:H1");
			sheet.getCell("A1").value = `Tháng ${month} 2022`;
			sheet.getCell("A1").font = {
				name: "Arial",
				size: 20,
				bold: true,
			};
			sheet.getCell("A1").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			sheet.getRow(2).height = 20;
			sheet.mergeCells("A2:B2");
			sheet.getCell("A2").value = `Tên`;
			sheet.getCell("A2").font = {
				name: "Arial",
				size: 10,
				bold: true,
			};
			sheet.getCell("A2").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			sheet.mergeCells("C2:D2");
			sheet.getCell("C2").value = `Email`;
			sheet.getCell("C2").font = {
				name: "Arial",
				size: 10,
				bold: true,
			};
			sheet.getCell("C2").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			sheet.mergeCells("E2:F2");
			sheet.getCell("E2").value = `Số lần đăng nhập`;
			sheet.getCell("E2").font = {
				name: "Arial",
				size: 10,
				bold: true,
			};
			sheet.getCell("E2").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			sheet.mergeCells("G2:H2");
			sheet.getCell("G2").value = `Số lần đăng xuất`;
			sheet.getCell("G2").font = {
				name: "Arial",
				size: 10,
				bold: true,
			};
			sheet.getCell("G2").alignment = {
				vertical: "middle",
				horizontal: "center",
			};

			let rowExcel = 3;
			data.forEach((rowData) => {
				sheet.getRow(rowExcel).height = 20;
				sheet.mergeCells(`A${rowExcel}:B${rowExcel}`);
				sheet.getCell(`A${rowExcel}`).value = rowData.name;
				sheet.getCell(`A${rowExcel}`).font = {
					name: "Arial",
					size: 10,
				};
				sheet.getCell(`A${rowExcel}`).alignment = {
					vertical: "middle",
					horizontal: "left",
				};

				sheet.mergeCells(`C${rowExcel}:D${rowExcel}`);
				sheet.getCell(`C${rowExcel}`).value = rowData.email;
				sheet.getCell(`C${rowExcel}`).font = {
					name: "Arial",
					size: 10,
				};
				sheet.getCell(`C${rowExcel}`).alignment = {
					vertical: "middle",
					horizontal: "left",
				};

				sheet.mergeCells(`E${rowExcel}:F${rowExcel}`);
				sheet.getCell(`E${rowExcel}`).value =
					rowData.countLogin + " lần";
				sheet.getCell(`E${rowExcel}`).font = {
					name: "Arial",
					size: 10,
				};
				sheet.getCell(`E${rowExcel}`).alignment = {
					vertical: "middle",
					horizontal: "left",
				};

				sheet.mergeCells(`G${rowExcel}:H${rowExcel}`);
				sheet.getCell(`G${rowExcel}`).value =
					rowData.countLogout + " lần";
				sheet.getCell(`G${rowExcel}`).font = {
					name: "Arial",
					size: 10,
				};
				sheet.getCell(`G${rowExcel}`).alignment = {
					vertical: "middle",
					horizontal: "left",
				};
				rowExcel++;
			});

			console.log("__dirname", __dirname);
			const time = new Date().getTime();
			const pathFile = path.join(
				__dirname,
				`../upload/infoLoginLogout${time}.xlsx`
			);
			await workbook.xlsx.writeFile(pathFile);

			// let uploadFileToCloudinary;
			if (!fs.existsSync(pathFile)) {
				return {
					code: 1001,
					message: "Tạo file excel thất bại",
				};

				// uploadFileToCloudinary = await cloudinary.v2.uploader.upload(
				// 	pathFile,
				// 	{
				// 		resource_type: "raw",
				// 	}
				// );
				// fs.unlink(pathFile, (err) => {
				// 	if (err) throw err;
				// 	console.log("successfully deleted");
				// });
			}

			// if (_.get(uploadFileToCloudinary, "secure_url", null) === null) {
			// 	return {
			// 		code: 1001,
			// 		message: "Thất bại",
			// 	};
			// }
		}

		return {
			code: 1000,
			message: "Đếm thành công",
			//urlExcel: uploadFileToCloudinary.secure_url,
			data,
		};
	} catch (err) {
		if (err.name === "MoleculerError") throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
