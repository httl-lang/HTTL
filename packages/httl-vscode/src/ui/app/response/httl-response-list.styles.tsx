import styled from 'styled-components';

export const Container = styled.div`
    margin: 7px;
`;

export const CurrentResponse = styled.div`
    display: flex;
    align-items: center;
    gap: 7px;
`;

export const ResponseList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;


export const Request = styled.div`
    flex: 1;
    width: 0;
`;

export const ResponseItemContainer = styled.div`
`;

export const ResponseItem = styled.div<{ active?: number }>`
    border-color: ${({ active }) => active ? 'var(--vscode-focusBorder) !important' : 'transparent'};
    position: relative;
    display: block;
    cursor: pointer;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 4px;
    box-sizing: border-box;
    
    padding: 2px 6px;
    flex: 1;

    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;

    white-space: nowrap;
    text-overflow: ellipsis;

    &:hover {
        border-color: var(--vscode-commandCenter-activeBorder);
    }
`;

const getColor = (method: string) => {
    switch (method.toLowerCase()) {
        case 'get':
            return '#6bdd9a';
        case 'post':
            return '#ffe47e';
        case 'put':
            return '#74aef6';
        case 'delete':
            return '#f79a8e';
        case 'patch':
            return '#c0a8e1';
        case 'head':
            return '#6bdd9a';
        case 'options':
            return '#f15eb0';
        default:
            return 'white';
    }
};

export const ResMethod = styled.span<{ method: string }>`
    font-weight: 500;
    margin-right: 6px;
    color: ${props => getColor(props.method)};
`;

export const ResUrl = styled.span`
`;

export const ResponseItemHost = styled.div`
    position: relative;
`;

export const MultipleIndicator = styled.div`
    height: 20px;
    padding: 2px 6px;

    position: absolute;
    display: block;
    flex: 1;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 4px;
    box-sizing: border-box;

    top: 8px;
    z-index: 0;
    zoom: 0.9;
    right: 5px;
    left: 3px;
    opacity: 0.6;
`;


export const RequestDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    width: 100%;
    min-height: 100%;
`;

export const Caption = styled.div`
`;

export const ReqHeader = styled.div`
`;

export const ReqBody = styled.div`
`;


export const DropDownItem = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    
    border-radius: 5px;

    &:hover {
        background-color: var(--vscode-input-background);
    }
`;

export const LineLabel = styled.span`
    margin: 0 6px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 12px;
    padding: 1px 0;
    color: #949494;
`;


export const RequestTitle = styled.div<{ active?: number }>`
    border-color: ${({ active }) => active ? 'var(--vscode-focusBorder) !important' : 'transparent'};

    display: block;
    cursor: pointer;
    background-color: var(--vscode-input-background);
    border: 1px solid var(--vscode-input-border, transparent);
    border-radius: 4px;
    box-sizing: border-box;
    
    padding: 2px 6px;
    flex: 1;

    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;

    white-space: nowrap;
    text-overflow: ellipsis;
`;