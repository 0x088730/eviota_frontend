import Wrapper from "../wrapper"
import {CardBackStyle} from './styled';

interface Props {
    value: string
}

const CardBackBox: React.FC<Props> = (props:any) => {
    return (
        <Wrapper>
            <CardBackStyle>{props.value}</CardBackStyle>           
        </Wrapper>
    )
}
export default CardBackBox