import Wrapper from "../wrapper"
import {CardStyle} from './styled';

interface Props {
    value: string
}

const CardBox: React.FC<Props> = (props:any) => {
    return(
        <Wrapper>
            <CardStyle>{props.value}</CardStyle>
        </Wrapper>
    )
}
export default CardBox