// src/admin/AdminPrintSettings.js
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const StyleControl = ({ title, style, onStyleChange }) => {
    const handleComplexStyleChange = (value) => {
        let fontWeight = 'normal';
        let fontStyle = 'normal';

        if (value === 'bold') {
            fontWeight = 'bold';
        } else if (value === 'italic') {
            fontStyle = 'italic';
        } else if (value === 'bold-italic') {
            fontWeight = 'bold';
            fontStyle = 'italic';
        }
        onStyleChange('fontWeight', fontWeight);
        onStyleChange('fontStyle', fontStyle);
    };

    let currentValue = 'normal';
    if (style.fontWeight === 'bold' && style.fontStyle === 'italic') {
        currentValue = 'bold-italic';
    } else if (style.fontWeight === 'bold') {
        currentValue = 'bold';
    } else if (style.fontStyle === 'italic') {
        currentValue = 'italic';
    }

    return (
        <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
            <p className="col-span-2 font-semibold text-primary-headline">{title}</p>
            <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-1">Cỡ chữ (pt)</label>
                <input
                    type="number"
                    value={style.fontSize}
                    onChange={(e) => onStyleChange('fontSize', parseFloat(e.target.value))}
                    className="w-full p-2 bg-primary-secondary rounded-lg"
                    min="8"
                    max="24"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-primary-paragraph mb-1">Kiểu chữ</label>
                <select
                    value={currentValue}
                    onChange={(e) => handleComplexStyleChange(e.target.value)}
                    className="w-full p-2 bg-primary-secondary rounded-lg"
                >
                    <option value="normal">Bình thường</option>
                    <option value="bold">In đậm</option>
                    <option value="italic">In nghiêng</option>
                    <option value="bold-italic">Đậm & Nghiêng</option>
                </select>
            </div>
        </div>
    );
};

const AdminPrintSettings = ({ initialSettings }) => {
    const [settings, setSettings] = useState(() => {
        try {
            const savedSettings = localStorage.getItem('printSettings');
            return savedSettings ? { ...initialSettings, ...JSON.parse(savedSettings) } : initialSettings;
        } catch {
            return initialSettings;
        }
    });

    // Loại bỏ state `printers` và logic `fetchPrinters` vì không còn cần thiết cho window.print()
    const [preview, setPreview] = useState('');

    useEffect(() => {
        localStorage.setItem('printSettings', JSON.stringify(settings));
        generatePreview();
    }, [settings]);

    const handleSettingChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
        }));
    };
    
    const handleStyleChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            }
        }));
    };

    const handleRestoreDefaults = () => {
        setSettings(initialSettings);
    };
    
    const generatePreview = () => {
        const getStyleString = (styleObj = {}) => `font-size: ${styleObj.fontSize || 9}pt; font-weight: ${styleObj.fontWeight || 'normal'}; font-style: ${styleObj.fontStyle || 'normal'};`;
        // Cập nhật nội dung preview để phản ánh các cài đặt mới, bao gồm QR code
        const previewContent = `<div style="font-family: '${settings.fontFamily}', monospace; line-height: ${settings.lineSpacing}mm; color: #000; width: 57mm; padding: 3mm; box-sizing: border-box; border: 1px solid #ccc; background: white;">${settings.showStoreName?`<div style="text-align: center; margin-bottom: 5px;"><h1 style="margin: 0; ${getStyleString(settings.headerStyle)}">${settings.restaurantName}</h1><p style="margin: 1px 0; ${getStyleString(settings.subHeaderStyle)}">${settings.address}</p><p style="margin: 1px 0; ${getStyleString(settings.subHeaderStyle)}">ĐT: ${settings.phone}</p></div>`:''}${settings.useSeparatorLine?'<div style="border-top: 1px dashed #000; margin: 5px 0;"></div>':''}<div style="${getStyleString(settings.orderInfoStyle)}"><p>Bàn: 1 | ${settings.showDateTime?`Ngày: ${new Date().toLocaleString('vi-VN')}`:''}</p>${settings.showCashier?'<p>Thu ngân: Nguyễn Văn A</p>':''}</div>${settings.useSeparatorLine?'<div style="border-top: 1px dashed #000; margin: 5px 0;"></div>':''}<table style="width: 100%; border-collapse: collapse; margin-top: 5px;"><thead style="${getStyleString(settings.itemsHeaderStyle)}"><tr><th style="text-align: left; padding: 2px 0;">Tên món</th><th style="text-align: center; width: 30px;">SL</th><th style="text-align: right;">T.Tiền</th></tr></thead><tbody style="${getStyleString(settings.itemsBodyStyle)}"><tr><td>Phở Bò Đặc Biệt</td><td style="text-align: center;">1</td><td style="text-align: right;">89,000</td></tr><tr><td>Cà Phê Đen Đá</td><td style="text-align: center;">2</td><td style="text-align: right;">50,000</td></tr></tbody></table>${settings.useSeparatorLine?'<div style="border-top: 1px dashed #000; margin: 5px 0;"></div>':''}<div style="text-align: right; margin-top: 5px; ${getStyleString(settings.totalStyle)}">${settings.totalLabel} 139,000đ</div>${settings.showWifi&&settings.wifiPassword?`<div style="text-align: center; margin-top: 10px; ${getStyleString(settings.wifiStyle)}">Pass Wi-Fi: ${settings.wifiPassword}</div>`:''}<div style="text-align: center; margin-top: 10px; ${getStyleString(settings.footerStyle)}">${settings.thankYouMessage}${settings.showQrCode?'<br/>[QR Code Placeholder]':''}</div></div>`;
        setPreview(previewContent);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3 h-full overflow-y-auto pr-4">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-primary-headline">Tùy chỉnh Hóa đơn</h2><button onClick={handleRestoreDefaults} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors"><RotateCcw size={18} /> Khôi phục</button></div>
                
                {/* Cài đặt chung */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Cài đặt chung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Font chữ chung</label>
                            <select name="fontFamily" value={settings.fontFamily} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl">
                                <option value="Courier New">Courier New</option>
                                <option value="Arial">Arial</option>
                                <option value="Times New Roman">Times New Roman</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Khoảng cách dòng (mm)</label>
                            <input type="number" name="lineSpacing" value={settings.lineSpacing} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" min="1" max="10" step="0.5"/>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="useSeparatorLine" className="font-medium text-primary-paragraph">Dùng đường phân cách</label>
                            <button onClick={() => setSettings(prev => ({...prev, useSeparatorLine: !prev.useSeparatorLine}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.useSeparatorLine ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.useSeparatorLine ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Phần đầu hóa đơn (Header) */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary-headline">Phần đầu hóa đơn (Header)</h3>
                        <div className="flex items-center gap-2">
                            <label htmlFor="showStoreName" className="font-medium text-primary-paragraph">Hiển thị</label>
                            <button onClick={() => setSettings(prev => ({...prev, showStoreName: !prev.showStoreName}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.showStoreName ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.showStoreName ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                    {settings.showStoreName && (
                        <div className="mt-4">
                            <div className="space-y-4">
                                <input type="text" name="restaurantName" placeholder="Tên quán" value={settings.restaurantName} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                                <input type="text" name="address" placeholder="Địa chỉ" value={settings.address} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                                <input type="text" name="phone" placeholder="Số điện thoại" value={settings.phone} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                            </div>
                            <StyleControl title="Style Tên quán" style={settings.headerStyle} onStyleChange={(key, value) => handleStyleChange('headerStyle', key, value)} />
                            <StyleControl title="Style Địa chỉ & SĐT" style={settings.subHeaderStyle} onStyleChange={(key, value) => handleStyleChange('subHeaderStyle', key, value)} />
                        </div>
                    )}
                </div>

                {/* Thông tin đơn hàng */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Thông tin đơn hàng</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <label htmlFor="showDateTime" className="font-medium text-primary-paragraph">Hiển thị Ngày & Giờ</label>
                        <button onClick={() => setSettings(prev => ({...prev, showDateTime: !prev.showDateTime}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.showDateTime ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.showDateTime ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <label htmlFor="showCashier" className="font-medium text-primary-paragraph">Hiển thị Thu ngân</label>
                        <button onClick={() => setSettings(prev => ({...prev, showCashier: !prev.showCashier}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.showCashier ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.showCashier ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                    <StyleControl title="Style chung" style={settings.orderInfoStyle} onStyleChange={(key, value) => handleStyleChange('orderInfoStyle', key, value)} />
                </div>

                {/* Danh sách sản phẩm */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Danh sách sản phẩm</h3>
                    <StyleControl title="Style tiêu đề" style={settings.itemsHeaderStyle} onStyleChange={(key, value) => handleStyleChange('itemsHeaderStyle', key, value)} />
                    <StyleControl title="Style nội dung" style={settings.itemsBodyStyle} onStyleChange={(key, value) => handleStyleChange('itemsBodyStyle', key, value)} />
                </div>

                {/* Thông tin Wi-Fi */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-primary-headline">Thông tin Wi-Fi</h3>
                        <div className="flex items-center gap-2">
                            <label htmlFor="showWifi" className="font-medium text-primary-paragraph">Hiển thị</label>
                            <button onClick={() => setSettings(prev => ({...prev, showWifi: !prev.showWifi}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.showWifi ? 'bg-primary-button' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.showWifi ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                    </div>
                    {settings.showWifi && (
                        <div className="mt-4">
                            <input type="text" name="wifiPassword" placeholder="Nhập mật khẩu Wi-Fi" value={settings.wifiPassword} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                            <StyleControl title="Style Wi-Fi" style={settings.wifiStyle} onStyleChange={(key, value) => handleStyleChange('wifiStyle', key, value)} />
                        </div>
                    )}
                </div>

                {/* Phần cuối hóa đơn (Footer) */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mb-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Phần cuối hóa đơn (Footer)</h3>
                    <input type="text" name="totalLabel" placeholder="Nhãn tổng cộng" value={settings.totalLabel} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl mb-4" />
                    <input type="text" name="thankYouMessage" placeholder="Lời cảm ơn" value={settings.thankYouMessage} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                    <StyleControl title="Style Tổng cộng" style={settings.totalStyle} onStyleChange={(key, value) => handleStyleChange('totalStyle', key, value)} />
                    <StyleControl title="Style Lời cảm ơn" style={settings.footerStyle} onStyleChange={(key, value) => handleStyleChange('footerStyle', key, value)} />
                    
                    {/* NEW: Toggle for QR Code */}
                    <div className="flex items-center gap-2 mt-4">
                        <label htmlFor="showQrCode" className="font-medium text-primary-paragraph">Hiển thị mã QR thanh toán</label>
                        <button onClick={() => setSettings(prev => ({...prev, showQrCode: !prev.showQrCode}))} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${settings.showQrCode ? 'bg-primary-button' : 'bg-gray-300'}`}>
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${settings.showQrCode ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                    </div>
                </div>

                {/* Phần cài đặt máy in (đã được đơn giản hóa) */}
                {/* Các trường defaultPrinter và printerShareName giờ đây chỉ mang tính chất hiển thị, không còn ảnh hưởng đến chức năng in thực tế */}
                <div className="bg-primary-main rounded-2xl p-6 shadow-xl mt-6">
                    <h3 className="text-xl font-bold text-primary-headline mb-4">Cài đặt Máy in (Chỉ tham khảo)</h3>
                    <p className="text-primary-paragraph text-sm mb-4">
                        Các cài đặt này chỉ mang tính chất hiển thị và không ảnh hưởng đến chức năng in trực tiếp qua trình duyệt (Ctrl+P).
                        Nếu bạn cần in qua máy in nhiệt chuyên dụng, bạn sẽ cần một ứng dụng hỗ trợ in riêng.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên máy in mặc định</label>
                            <input type="text" name="defaultPrinter" value={settings.defaultPrinter} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" placeholder="Tên máy in (ví dụ: POS-80C)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-primary-paragraph mb-2">Tên chia sẻ máy in (Share name)</label>
                            <input type="text" name="printerShareName" placeholder="Ví dụ: XP58 hoặc K80" value={settings.printerShareName} onChange={handleSettingChange} className="w-full p-3 bg-primary-secondary rounded-xl" />
                            <p className="text-xs text-gray-500 mt-1">Đây là tên bạn đã đặt trong tab "Sharing" của Printer Properties trên Windows.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/3 h-full">
                <h3 className="text-2xl font-bold text-primary-headline mb-4">Xem trước</h3>
                <div className="bg-gray-100 p-4 rounded-xl overflow-x-auto">
                    {/* Preview content now reflects QR code placeholder */}
                    <div className="w-[57mm] scale-100" dangerouslySetInnerHTML={{ __html: preview }} />
                </div>
            </div>
        </div>
    );
};

export default AdminPrintSettings;
