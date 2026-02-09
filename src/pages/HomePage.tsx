import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, BookOpen } from 'lucide-react';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background space-y-8 p-6">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
                    포켓몬 월드
                </h1>
                <p className="text-xl text-muted-foreground">
                    모험을 시작할 준비가 되셨나요?
                </p>
            </div>

            <div className="grid gap-4 w-full max-w-md">
                <Button
                    size="lg"
                    className="h-16 text-lg"
                    onClick={() => navigate('/game')}
                >
                    <Gamepad2 className="mr-2 h-6 w-6" />
                    끝말잇기 게임 시작
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    className="h-16 text-lg"
                    onClick={() => navigate('/pokedex')}
                >
                    <BookOpen className="mr-2 h-6 w-6" />
                    포켓몬 도감 (준비중)
                </Button>
            </div>
        </div>
    );
}
