import React, { useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useLocation, useHistory } from 'react-router-dom';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import { Container, Content, AnimationContainer, Background } from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SignIn: React.FC = () => {
    const query = useQuery();
    const formRef = useRef<FormHandles>(null);
    const { signIn } = useAuth();
    const { addToast } = useToast();

    const history = useHistory();
    const token = query.get('token');

    const handleSubmit = useCallback(
        async (data: ResetPasswordFormData) => {
            try {
                formRef.current?.setErrors({});
                const schema = Yup.object().shape({
                    password: Yup.string().required('Senha obrigatória'),
                    password_confirmation: Yup.string().oneOf(
                        [Yup.ref('password'), undefined],
                        'Confirmação incorreta',
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                if (!token) {
                    throw new Error();
                }

                const { password, password_confirmation } = data;

                await api.post('password/reset', {
                    password,
                    password_confirmation,
                    token,
                });

                history.push('/');

                addToast({
                    type: 'success',
                    title: 'Senha alterada com sucesso',
                    description: 'Faça login com a sua nova senha',
                });
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);
                    return;
                }

                addToast({
                    type: 'error',
                    title: 'Erro ao resetar senha',
                    description:
                        'Ocorreu um erro ao resetar sua senha, tente novamente.',
                });
            }
        },
        [addToast, history, token],
    );

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <h1>Resetar sennha</h1>

                        <Input
                            name="password"
                            icon={FiLock}
                            placeholder="Nova senha"
                            type="password"
                        />

                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            placeholder="Confirmação da senha"
                            type="password"
                        />
                        <Button type="submit">Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />
        </Container>
    );
};

export default SignIn;
