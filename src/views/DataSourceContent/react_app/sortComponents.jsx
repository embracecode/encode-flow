

// 自定义菜单组件
const CustomHeaderMenu = (props) => {
    console.log(props, 'props');
    // const { onHide, col, onSortChanged } = props;

    // const onSort = (direction) => {
    //     onSortChanged(direction, true);
    //     handleSort(col.id, direction);
    //     onHide();
    // };

    return (
        <div style={{ background: 'white', border: '1px solid #ccc', width: '100px' }}>
            {/* <div onClick={() => onSort('asc')} style={{ cursor: 'pointer', padding: '4px' }}>
                🔼 升序
            </div>
            <div onClick={() => onSort('desc')} style={{ cursor: 'pointer', padding: '4px' }}>
                🔽 降序
            </div> */}
            111
        </div>
    );
};
export default CustomHeaderMenu